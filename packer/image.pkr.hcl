packer {
  required_plugins {
    googlecompute = {
      source  = "github.com/hashicorp/googlecompute"
      version = ">= 1.1.4"
    }
  }
}

variable "project_id" {
  description = "The project ID to deploy to"
  type        = string
}

variable "zone" {
  description = "The zone to deploy to"
  type        = string
  default     = "us-east1-b"
}

variable "source_image" {
  description = "The source image to use for the instance"
  type        = string
  default     = null
}

variable "source_image_family" {
  description = "The source image family to use for the instance"
  type        = string
  default     = "centos-stream-8"
}

variable "disk_size" {
  description = "The size of the disk to create"
  type        = number
  default     = 20
}

variable "disk_type" {
  description = "The type of the disk to create"
  type        = string
  default     = "pd-standard"
}

variable "image_name" {
  description = "The name of the image to create"
  type        = string
  default     = "csye6225-webapp-image-{{timestamp}}"
}

variable "image_description" {
  description = "The description of the image to create"
  type        = string
  default     = "Image for CSYE6225 Webapp"
}

variable "image_family" {
  description = "The family of the image to create"
  type        = string
  default     = "csye6225-webapp-image"
}

variable "image_storage_locations" {
  description = "The storage locations of the image to create"
  type        = list(string)
  default     = ["us"]
}

variable "ssh_username" {
  description = "The username to use for SSH"
  type        = string
  default     = "packer"
}

source "googlecompute" "csye6225-webapp-image" {
  project_id              = var.project_id
  zone                    = var.zone
  source_image            = var.source_image
  source_image_family     = var.source_image_family
  disk_size               = var.disk_size
  disk_type               = var.disk_type
  image_name              = var.image_name
  image_description       = var.image_description
  image_family            = var.image_family
  image_project_id        = var.project_id
  image_storage_locations = var.image_storage_locations
  ssh_username            = var.ssh_username
}

build {
  sources = ["source.googlecompute.csye6225-webapp-image"]

  provisioner "shell" {
    inline = ["mkdir -p /tmp/setup"]
  }

  provisioner "file" {
    source      = "webapp"
    destination = "/tmp/setup/webapp"
  }

  provisioner "file" {
    source      = "packer/scripts/systemd/csye6225-webapp.service"
    destination = "/tmp/setup/csye6225-webapp.service"
  }

  provisioner "shell" {
    execute_command = "chmod +x {{ .Path }}; {{ .Vars }} sudo -E sh -eu '{{ .Path }}'"
    scripts = [
      "packer/scripts/install-dependencies.sh",
      "packer/scripts/create-user.sh",
      "packer/scripts/allow-port-access.sh",
      "packer/scripts/setup-webapp.sh",
      "packer/scripts/setup-systemd.sh"
    ]
  }
}
